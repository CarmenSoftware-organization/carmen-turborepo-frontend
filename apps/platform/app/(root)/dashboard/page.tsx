import DashboardComponent from "./components/DashboardComponent";
import PageWrapper from "@/app/components/PageWrapper";

export async function generateMetadata() {
    return {
        title: 'Dashboard | Carmen Platform',
        description: 'Dashboard page for Carmen Platform',
    };
}

export default function DashboardPage() {
    return (
        <PageWrapper title="Dashboard" description="Dashboard page for Carmen Platform">
            <DashboardComponent />
        </PageWrapper>
    );
}
