export type OperatorType = 'eq' | 'lt' | 'gt' | 'lte' | 'gte';
export type ActionType = 'SKIP_STAGE' | 'NEXT_STAGE';
export type NotificationChannel = 'Email' | 'System';
export type NotificationEventTrigger =
	| 'onSubmit'
	| 'onApprove'
	| 'onReject'
	| 'onSendBack'
	| 'onSLA';

export interface Product {
	id: number;
	name: string;
	code: string;
	category: string;
	subCategory?: string;
	itemGroup?: string;
}

export interface Stage {
	id: number;
	name: string;
	description: string;
	sla: string;
	sla_unit: string;
	available_actions: string[];
	hide_fields: {
		price_per_unit: boolean;
		total_price: boolean;
	};
	assigned_users: {
		id: number;
		name: string;
		department: string;
		location: string;
	}[];
}

export interface RoutingCondition {
	field: string;
	operator: OperatorType;
	value: string;
}

export interface RoutingAction {
	type: ActionType;
	parameters: {
		targetStage: string;
	};
}

export interface RoutingRule {
	id: number;
	name: string;
	description: string;
	trigger_stage: string;
	condition: RoutingCondition;
	action: RoutingAction;
}

export interface WorkflowNotification {
	id: number;
	event?: string;
	event_trigger?: NotificationEventTrigger;
	description?: string;
	recipients?: string[];
	channels?: NotificationChannel[];
}

export interface Template {
	id: number;
	name: string;
	event_trigger: NotificationEventTrigger;
	description?: string;
	subject_line: string;
	content: string;
}

export interface WorkflowData {
	documentReferencePattern: string;
	stages: Stage[];
	routingRules: RoutingRule[];
	notifications: WorkflowNotification[];
	notificationTemplates: Template[];
	products: Product[];
}

export interface Workflow {
	id: string;
	name: string;
	workflow_type: string;
	data: WorkflowData;
	description: string;
	is_active: boolean;
}
