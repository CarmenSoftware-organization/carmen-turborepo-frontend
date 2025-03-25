"use client";

import { Button } from "@/components/ui/button"
import { mockCategoryData } from "@/mock-data/category"
import { useState } from "react"
import { Plus } from "lucide-react"
import TreeNode from "./TreeNode"
import { CategoryNode } from "@/dtos/category"

export default function CategoryComponent() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
        const initialExpanded: Record<string, boolean> = {}
        mockCategoryData.forEach((category) => {
            initialExpanded[category.id] = true
        })
        return initialExpanded
    })

    const expandAll = () => {
        const allExpanded: Record<string, boolean> = {}

        const addAllNodes = (nodes: CategoryNode[]) => {
            nodes.forEach((node) => {
                allExpanded[node.id] = true
                if (node.children && node.children.length > 0) {
                    addAllNodes(node.children)
                }
            })
        }

        addAllNodes(mockCategoryData)
        setExpanded(allExpanded)
    }

    const collapseAll = () => {
        const topLevelOnly: Record<string, boolean> = {}
        mockCategoryData.forEach((category) => {
            topLevelOnly[category.id] = false
        })
        setExpanded(topLevelOnly)
    }

    // Toggle expand/collapse for a node
    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="container flex items-center justify-end">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={expandAll}>
                        Expand All
                    </Button>
                    <Button variant="outline" onClick={collapseAll}>
                        Collapse All
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4" /> Add Category
                    </Button>
                </div>
            </div>
            {mockCategoryData.map((node) => (
                <TreeNode key={node.id} node={node} expanded={expanded} toggleExpand={toggleExpand} />
            ))}
        </div>
    )
}
