export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const originalConsoleLog = console.log;
		console.log = (...args) => {
			const now = new Date().toLocaleString('th-TH', {
				timeZone: 'Asia/Bangkok',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
			originalConsoleLog(`[${now}]`, ...args);
		};
	}
}
