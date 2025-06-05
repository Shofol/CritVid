// Simple cron service for auto-approving critiques
export const cronService = {
  async runAutoApproval() {
    try {
      const response = await fetch(
        'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/87200769-ae86-4f82-97bf-3f48add582dc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to run auto-approval');
      }

      return await response.json();
    } catch (error) {
      console.error('Auto-approval error:', error);
      throw error;
    }
  },

  // Start periodic check (in a real app, this would be a server-side cron job)
  startPeriodicCheck() {
    try {
      // Run every hour
      setInterval(() => {
        this.runAutoApproval().catch(console.error);
      }, 60 * 60 * 1000);
    } catch (error) {
      console.error('Failed to start periodic check:', error);
    }
  }
};

// Initialize on app start with error handling
if (typeof window !== 'undefined') {
  try {
    cronService.startPeriodicCheck();
  } catch (error) {
    console.error('Failed to initialize cron service:', error);
  }
}