import GmSettingForm from "./GmSettingForm";

export default function SettingGeneral() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">General</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>
            <GmSettingForm />
        </div>
    )
}
