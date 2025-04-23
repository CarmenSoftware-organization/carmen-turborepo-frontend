"use client";
import React, { useEffect, useState } from "react";
import WorkflowDetail from "../components/WorkflowDetail";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { getWorkflowId } from "@/services/workflow";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";

const WorkflowDetailPage = () => {
  const { token, tenantId, isLoading: authLoading } = useAuth();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id[0];
  const [wfData, setWfdata] = useState<WorkflowCreateModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    // Only fetch product when token and tenantId are available and auth is not loading
    if (!token || !tenantId || authLoading) {
      return;
    }
    const fetchById = async () => {
      try {
        const data = await getWorkflowId(token, tenantId, id);
        if (data.statusCode === 401) {
          setLoginDialogOpen(true);
          return;
        }
        setWfdata(data);
      } catch (error) {
        console.error("Error fetching workflow:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchById();
  }, [token, tenantId, id, authLoading]);

  // Show loading state if auth is still loading or we're fetching product data
  if (authLoading || (loading && token && tenantId)) {
    return <div>Loading product information...</div>;
  }

  // Show loading state if auth is still loading or we're fetching product data
  if (authLoading || (loading && token && tenantId)) {
    return <div>Loading product information...</div>;
  }

  // eslint-disable-next-line react/react-in-jsx-scope
  return (
    <>
      <WorkflowDetail mode={formType.EDIT} initialValues={wfData} />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
};

export default WorkflowDetailPage;
