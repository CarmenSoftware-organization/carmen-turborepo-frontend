interface Cluster {
  id: string;
  name: string;
}

export const cluster: Cluster[] = [
  {
    id: "cluster-1",
    name: "Cluster 1",
  },
  {
    id: "cluster-2",
    name: "Cluster 2",
  },
  {
    id: "cluster-3",
    name: "Cluster 3",
  },
];

interface UserType {
  user_id: string;
  name: string;
}

export const userType: UserType[] = [
  {
    user_id: "user-1",
    name: "User 1",
  },
  {
    user_id: "user-2",
    name: "User 2",
  },
  {
    user_id: "user-3",
    name: "User 3",
  },
];

export interface BuFormValues {
  cluster_id: string;
  code: string;
  name: string;
  is_hq: boolean;
}
