import moment from 'moment-hijri'

/**
 * Converts Gregorian date to Hijri (Umm al-Qura calendar)
 * @param gregorianDate - Date string in format YYYY-MM-DD
 * @returns Formatted Hijri date string
 */
export const convertToHijri = (gregorianDate: string | null): string | null => {
  if (!gregorianDate) return null

  try {
    moment.locale('en');
    // Parse the Gregorian date and convert to Hijri
    const hijriMoment = moment(gregorianDate, 'YYYY-MM-DD')

    // Format: YYYY-MM-DD in Hijri
    return hijriMoment.format('iYYYY-iMM-iDD')
  } catch (error) {
    console.error('Error converting to Hijri:', error)
    return null
  }
}

/**
 * Get formatted Hijri date with month name in Arabic
 */
export const getFormattedHijriDate = (gregorianDate: string | null): string | null => {
  if (!gregorianDate) return null

  try {
    moment.locale('en');
    const hijriMoment = moment(gregorianDate, 'YYYY-MM-DD')

    // Format: DD Month_Name YYYY in Arabic
    return hijriMoment.format('iYYYY-iMM-iDD')
  } catch (error) {
    console.error('Error formatting Hijri date:', error)
    return null
  }
}
