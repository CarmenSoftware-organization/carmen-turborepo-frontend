"use client";
import WorkflowDetail from "../_components/WorkflowDetail";
import { User } from "@/dtos/workflows.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";
import { useUserList } from "@/hooks/useUserList";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useWorkflowDetail } from "../_hook/use-workflow-detail";
import { useProductQuery } from "@/hooks/use-product-query";

const WorkflowDetailPage = () => {
  const { token, buCode, isLoading: authLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const { userList } = useUserList(token, buCode);
  const { products } = useProductQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    },
  });

  const listProduct = products?.data ?? [];

  const listUser: User[] = userList?.map((user: User) => ({
    key: user.user_id,
    ...user,
    initials: user.firstname.charAt(0) + user.lastname.charAt(0),
  }));

  const { data, loading, loginDialogOpen, setLoginDialogOpen } = useWorkflowDetail({
    token,
    buCode,
    id,
    authLoading,
  });

  if (authLoading || (loading && token && buCode)) {
    return <DetailLoading />;
  }

  // eslint-disable-next-line react/react-in-jsx-scope
  return (
    <>
      <WorkflowDetail
        mode={formType.EDIT}
        initialValues={data}
        listUser={listUser}
        listProduct={listProduct}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
};

export default WorkflowDetailPage;
