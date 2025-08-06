
import { Metadata } from "next";
import ConfPage from "./ConfPage";

export const metadata: Metadata = {
  title: "Configuration",
};

export default function Configuration() {
  return <ConfPage />
}
