"use client";
import React from "react";
import WorkflowDetail from "../_components/WorkflowDetail";
import { formType } from "@/dtos/form.dto";

const NewWorkflowPage = () => {
  return <WorkflowDetail mode={formType.ADD} initialValues={null} />;
};

export default NewWorkflowPage;
