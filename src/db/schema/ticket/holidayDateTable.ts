export const createHolidayDateTable = `
  CREATE TABLE IF NOT EXISTS holiday_date (
    holiday_date DATE PRIMARY KEY,
    name TEXT NOT NULL
  );
`;

export const insertHolidayDate = `
  INSERT INTO holiday_date (holiday_date, name)
  VALUES
    ('2026-01-01', 'New Year''s Day'),
    ('2026-02-16', 'Family Day'),
    ('2026-04-03', 'Good Friday'),
    ('2026-05-18', 'Victoria Day'),
    ('2026-07-01', 'Canada Day'),
    ('2026-09-07', 'Labour Day'),
    ('2026-10-12', 'Thanksgiving Day'),
    ('2026-11-11', 'Remembrance Day'),
    ('2026-12-25', 'Christmas Day')
  ON CONFLICT (holiday_date) DO NOTHING;
`;
