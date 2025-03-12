const KAFKA_CONFIG = {
	host: process.env.NEXT_PUBLIC_KAFKA_HOST || 'localhost:9092',
	topic: process.env.NEXT_PUBLIC_KAFKA_TOPIC || 'my-topic',
	timeout: 30000,
	partition: 0,
} as const;

export default KAFKA_CONFIG;
