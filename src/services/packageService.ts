// Purpose:
// Minimal mock package service for local development.
//
// - createPackage(payload): simulates a backend call and returns a realistic
//   mock response that includes `trackingNumber` (and `tracking_number`) so
//   front-end code that expects a tracking id can proceed without throwing.
// - Keep the function async and include a small delay to mimic network latency.
//
// Notes:
// - In production you will replace this implementation with a real API call
//   (fetch / axios / supabase RPC).
export interface PackageCreationPayload {
  [key: string]: any;
}

function generateMockTrackingNumber(prefix = 'TII', digits = 6) {
  const rand = Math.floor(Math.random() * Math.pow(10, digits))
    .toString()
    .padStart(digits, '0');
  const ts = Date.now().toString().slice(-4);
  return `${prefix}-${ts}-${rand}`;
}

export const packageService = {
  /**
   * Simulate creating a package on the backend.
   * Returns:
   *  { success: boolean, id: string, trackingNumber: string, tracking_number: string }
   */
  createPackage: async (data: PackageCreationPayload) => {
    console.info('Mock createPackage called', data);

    // Simulate small latency to reproduce a realistic dev UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trackingNumber = generateMockTrackingNumber();

    return {
      success: true,
      id: `mock-${Math.floor(Math.random() * 100000)}`,
      trackingNumber,
      tracking_number: trackingNumber,
      _debug: { createdAt: new Date().toISOString(), payloadPreview: data?.description || null },
    };
  },
};