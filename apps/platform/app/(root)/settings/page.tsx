import { Suspense } from "react";
import SettingGeneral from "./components/SettingGeneral";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingGeneral />
        </Suspense>
    );
}
