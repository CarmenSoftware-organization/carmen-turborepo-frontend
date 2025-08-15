"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function LangSwitch() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale as "en" | "th" })
    }

    return (
        <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="th">TH</SelectItem>
            </SelectContent>
        </Select>
    )
}