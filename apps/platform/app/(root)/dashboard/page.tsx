import DashboardComponent from "./components/DashboardComponent";

export async function generateMetadata() {
    return {
        title: 'Dashboard | Carmen Platform',
        description: 'Dashboard page for Carmen Platform',
    };
}

export default function DashboardPage() {
    return (
        <DashboardComponent />
    );
}
