import ButtonLink from "@/components/ButtonLink"
import { useTranslations } from "next-intl";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";

interface Props {
    readonly currentMode: formType;
    readonly setCurrentMode: (mode: formType) => void;
    readonly title: string;
}

export default function ActionFields({ currentMode, setCurrentMode, title }: Props) {
    const tPurchaseRequest = useTranslations("PurchaseRequest");
    const tCommon = useTranslations("Common");

    return (
        <div className="fxr-c justify-between mb-4">
            <div className="fxr-c gap-2">
                <ButtonLink href="/procurement/purchase-order">
                    <ChevronLeft className="h-4 w-4" />
                </ButtonLink>
                {currentMode !== formType.ADD ? (
                    <p className="text-xl font-bold">{title}</p>

                ) : (
                    <p className="text-xl font-bold">{tPurchaseRequest("template")}</p>
                )}
            </div>
            <div className="fxr-c gap-2">
                {currentMode === formType.VIEW ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() => window.history.back()}
                        >
                            <ChevronLeft /> {tCommon("back")}
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() => setCurrentMode(formType.EDIT)}
                        >
                            <Pencil /> {tCommon("edit")}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() =>
                                currentMode === formType.ADD
                                    ? window.history.back()
                                    : setCurrentMode(formType.VIEW)
                            }
                        >
                            <X /> {tCommon("cancel")}
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="px-2 text-xs"
                            type="submit"
                        >
                            <Save /> {tCommon("save")}
                        </Button>
                    </>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="px-2 text-xs"
                >
                    <Printer /> {tCommon("print")}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="px-2 text-xs"
                >
                    <FileDown /> {tCommon("export")}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="px-2 text-xs"
                >
                    <Share /> {tCommon("share")}
                </Button>
            </div>
        </div>
    )
}