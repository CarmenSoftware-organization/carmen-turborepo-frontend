import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/carmen-ui/accordion';
import React from 'react'

const TestUiPage = () => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default TestUiPage;