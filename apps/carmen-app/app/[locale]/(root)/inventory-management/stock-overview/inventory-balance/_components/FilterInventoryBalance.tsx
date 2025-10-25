import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function FilterInventoryBalance() {
    return (
        <Card className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                )}
                            >
                                Pick a date
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Valuation Method</Label>
                    <Select>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Valuation Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">FIFO</SelectItem>
                            <SelectItem value="2">LIFO</SelectItem>
                            <SelectItem value="3">Average</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <Label>Location Range</Label>
                    <div className="flex gap-2">
                        <Input type="text" placeholder="From" />
                        <Input type="text" placeholder="To" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Category Range</Label>
                    <div className="flex gap-2">
                        <Input type="text" placeholder="From" />
                        <Input type="text" placeholder="To" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Product Range</Label>
                    <div className="flex gap-2">
                        <Input type="text" placeholder="From" />
                        <Input type="text" placeholder="To" />
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-2">
                <Button variant={"outline"} size={"sm"}>Reset</Button>
                <Button variant={"default"} size={"sm"}>Apply</Button>
            </div>
        </Card>
    );
}
