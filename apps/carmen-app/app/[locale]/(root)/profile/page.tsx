'use client';
import { useTranslations } from 'next-intl';
import { Link } from "@/lib/navigation";
export default function Profile() {
    const t = useTranslations('ProfilePage');

    return (
        <div className="p-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4">{t('profileTitle')}</h1>
                <p className="text-lg mb-4">{t('profileWelcome')}</p>
                <Link href="/" className="bg-blue-500 text-white p-2 rounded-md inline-block">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

