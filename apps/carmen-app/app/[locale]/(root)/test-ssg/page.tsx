import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'TestSSGPage' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export async function generateStaticParams() {
    return [];
}

async function getData() {
    return {
        lastUpdated: new Date().toISOString(),
        content: 'This content was generated at build time',
        items: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
        ],
    };
}

export default async function TestSSG({ params: { locale } }: Readonly<{ params: { locale: string } }>) {
    const data = await getData();
    const t = await getTranslations({ locale, namespace: 'TestSSGPage' });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('title')}</h1>

            <div className="p-4 rounded-lg border">
                <p>
                    {t('explanation')}
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{t('staticData')}</h2>
                <p className="mb-2">
                    <span className="font-medium">{t('generatedAt')}:</span> {data.lastUpdated}
                </p>
                <p className="mb-4">
                    <span className="font-medium">{t('content')}:</span> {data.content}
                </p>

                <h3 className="text-lg font-medium mb-3">{t('items')}:</h3>
                <ul className="space-y-2">
                    {data.items.map(item => (
                        <li key={item.id} className="p-3 rounded-md">
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                    <strong>{t('note')}:</strong> {t('noteText')}
                </p>
            </div>
        </div>
    );
}
