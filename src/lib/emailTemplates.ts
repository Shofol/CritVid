type TemplateData = {
  [key: string]: any;
};

/**
 * Generate HTML content for email templates based on template ID and data
 */
export function generateEmailTemplate(templateId: string, data: TemplateData = {}): {
  subject: string;
  html: string;
} {
  // Format date safely with fallback
  const formatDate = (dateInput: any): string => {
    if (!dateInput) return 'N/A';
    try {
      return new Date(dateInput).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  switch (templateId) {
    case 'welcome':
      return {
        subject: 'Welcome to CritVid!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Welcome to CritVid!</h1>
            <p>Hello ${data.name || 'there'},</p>
            <p>Thank you for joining CritVid, the platform that connects dancers with professional adjudicators for personalized video critiques.</p>
            <p>Here's what you can do now:</p>
            <ul>
              <li>Upload your dance videos</li>
              <li>Connect with professional adjudicators</li>
              <li>Receive personalized critiques</li>
              <li>Improve your technique and performance</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Happy dancing!</p>
            <p>The CritVid Team</p>
          </div>
        `
      };

    case 'critique_ready':
      return {
        subject: 'Your Critique is Ready!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Your Critique is Ready!</h1>
            <p>Hello ${data.name || 'there'},</p>
            <p>Great news! Your critique for "${data.videoTitle || 'your video'}" is now ready to view.</p>
            <p>Log in to your CritVid account to watch your personalized feedback and start improving your performance.</p>
            <p>The CritVid Team</p>
          </div>
        `
      };

    case 'critique_submitted':
      return {
        subject: 'Your Critique Has Been Submitted',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Critique Submitted</h1>
            <p>Hello ${data.name || 'there'},</p>
            <p>Your critique for "${data.videoTitle || 'your video'}" has been successfully submitted.</p>
            <p>Thank you for using CritVid to share your expertise and help dancers improve!</p>
            <p>The CritVid Team</p>
          </div>
        `
      };

    case 'payment_confirmation':
      return {
        subject: 'Payment Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Payment Confirmation</h1>
            <p>Hello ${data.name || 'there'},</p>
            <p>We're confirming your payment of $${data.amount || '0.00'} for ${data.service || 'services'} on CritVid.</p>
            <p>Transaction ID: ${data.transactionId || 'N/A'}</p>
            <p>Date: ${formatDate(data.date)}</p>
            <p>Thank you for your business!</p>
            <p>The CritVid Team</p>
          </div>
        `
      };

    case 'password_reset':
      return {
        subject: 'Reset Your Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Reset Your Password</h1>
            <p>Hello ${data.name || 'there'},</p>
            <p>We received a request to reset your password for your CritVid account.</p>
            <p>If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the link below:</p>
            <p><a href="${data.resetLink || '#'}" style="color: #4f46e5;">Reset Password</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>The CritVid Team</p>
          </div>
        `
      };

    case 'test':
    default:
      return {
        subject: 'Test Email from CritVid',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Test Email</h1>
            <p>This is a test email to confirm that the SendGrid integration is active and functional.</p>
            <p>If you received this email, it means the email system is connected and operating as expected through the platform.</p>
            <p>Template ID: ${templateId}</p>
            <p>The CritVid Team</p>
          </div>
        `
      };
  }
}
