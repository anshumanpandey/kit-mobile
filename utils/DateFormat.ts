import { format, parseISO } from "date-fns"

export const BaseDateFormat = (d?: Date | string) => {
    if (!d) return ""
    return format(parseISO(d.toString()), 'MMM dd, yyyy')
}