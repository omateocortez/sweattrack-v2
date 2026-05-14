const db = require('../config/database');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const [sessionsCount] = await db.query(
      'SELECT COUNT(*) AS total FROM sessions WHERE user_id = ? AND status = "completed"',
      [userId]
    );

    const [lastSession] = await db.query(
      `SELECT sweat_rate_lh, hydric_deficit_ml, sodium_loss_mg, internal_temp, duration_minutes, ended_at
       FROM sessions WHERE user_id = ? AND status = "completed" ORDER BY ended_at DESC LIMIT 1`,
      [userId]
    );

    const [weeklyData] = await db.query(
      `SELECT DAYOFWEEK(started_at) AS day_num,
              DAYNAME(started_at) AS day_name,
              COUNT(*) AS session_count,
              AVG(sweat_rate_lh) AS avg_sweat_rate,
              SUM(duration_minutes) AS total_minutes
       FROM sessions
       WHERE user_id = ? AND status = "completed"
         AND started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DAYOFWEEK(started_at), DAYNAME(started_at)
       ORDER BY day_num`,
      [userId]
    );

    const [profile] = await db.query(
      'SELECT vo2max, weight_kg FROM athlete_profiles WHERE user_id = ?',
      [userId]
    );

    // Hydration index from WUTS urine color scale (Quaresma et al. 2025 ABNE)
    // Formula: 100 - (urineColor - 1) × 12, clamped [20, 100]
    // Only computed when the user has at least one completed session
    const [lastHydration] = await db.query(
      `SELECT urine_color FROM sessions WHERE user_id = ? AND urine_color IS NOT NULL ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    const totalSessions = sessionsCount[0].total;
    const hydrationIndex = (totalSessions > 0 && lastHydration[0]?.urine_color)
      ? Math.max(20, Math.min(100, Math.round(100 - (lastHydration[0].urine_color - 1) * 12)))
      : null;

    res.json({
      totalSessions: sessionsCount[0].total,
      lastSession: lastSession[0] || null,
      weeklyData,
      profile: profile[0] || {},
      hydrationIndex,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar analytics' });
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DATE(started_at) AS session_date,
              intensity,
              AVG(sweat_rate_lh) AS avg_sweat_rate,
              SUM(hydric_deficit_ml) AS total_deficit,
              SUM(duration_minutes) AS total_minutes,
              COUNT(*) AS sessions
       FROM sessions
       WHERE user_id = ? AND status = "completed"
         AND started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(started_at), intensity
       ORDER BY session_date DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar relatório semanal' });
  }
};

exports.getHydrationTrend = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DATE(created_at) AS d,
              AVG(sweat_rate_lh) AS avg_sweat,
              AVG(hydric_deficit_ml) AS avg_deficit
       FROM sessions
       WHERE user_id = ? AND status = "completed"
         AND created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
       GROUP BY DATE(created_at)
       ORDER BY d ASC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tendência' });
  }
};
