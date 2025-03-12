import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import { NextRequest, NextResponse } from 'next/server';
import KAFKA_CONFIG from '@/lib/util/kafka.config';

let producer: Producer | null = null;
let client: KafkaClient | null = null;

const initializeProducer = async (): Promise<Producer> => {
	if (!client || !producer) {
		client = new KafkaClient({ kafkaHost: KAFKA_CONFIG.host });
		producer = new Producer(client);

		await new Promise<void>((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Producer initialization timeout'));
			}, KAFKA_CONFIG.timeout);

			producer!.on('ready', () => {
				clearTimeout(timeoutId);
				resolve();
			});

			producer!.on('error', (error) => {
				clearTimeout(timeoutId);
				reject(error);
			});
		});

		process.on('SIGTERM', () => {
			if (producer) {
				producer.close(() => {
					console.log('Kafka producer closed due to application termination');
					process.exit(0);
				});
			}
		});
	}
	return producer;
};

const validateMessage = (message: unknown): message is string => {
	return typeof message === 'string' && message.trim().length > 0;
};

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();

		if (!validateMessage(body.message)) {
			return NextResponse.json(
				{
					error: 'Invalid message format. Message must be a non-empty string.',
					status: 'error',
				},
				{ status: 400 }
			);
		}

		const producer = await initializeProducer();

		const payloads: ProduceRequest[] = [
			{
				topic: KAFKA_CONFIG.topic,
				messages: body.message,
			},
		];

		const result = await new Promise<{
			success: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data?: any;
			error?: Error;
		}>((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Message sending timeout'));
			}, KAFKA_CONFIG.timeout);

			producer.send(payloads, (error, data) => {
				clearTimeout(timeoutId);
				if (error) {
					reject(error);
				} else {
					resolve({ success: true, data });
				}
			});
		});

		const data = {
			message: body.message,
			topic: KAFKA_CONFIG.topic,
			timestamp: new Date().toISOString(),
			metadata: result.data,
		};

		console.log('kafka data', data);

		return NextResponse.json(
			{
				data: data,
				status: 'success',
			},
			{
				status: 201,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Error in Kafka producer:', error);

		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		const statusCode = errorMessage.includes('timeout')
			? 504
			: errorMessage.includes('initialization')
				? 503
				: 500;

		return NextResponse.json(
			{
				error: errorMessage,
				status: 'error',
			},
			{
				status: statusCode,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
};