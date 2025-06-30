# ViewCritiqueFeedback Component

A comprehensive component for viewing all data of a critique feedback fetched by its ID. This component displays the complete critique feedback information including video, feedback, exercises, suggestions, and metadata.

## Features

- **Video Display**: Shows the feedback video with controls
- **Written Feedback**: Displays detailed written feedback
- **Notes**: Shows any additional notes from the adjudicator
- **Transcription**: Displays the audio transcription
- **Exercises**: Lists recommended exercises with descriptions
- **Suggestions**: Shows dance improvement suggestions
- **Metadata**: Displays creation date, completion date, status, and reference IDs
- **File Information**: Shows details about video and audio files

## Usage

### Route

```
/adjudicator/view-critique-feedback/:critiqueFeedbackId
```

### Example Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to view a specific critique feedback
navigate(`/adjudicator/view-critique-feedback/${critiqueFeedbackId}`);
```

### Example Link

```tsx
import { Link } from "react-router-dom";

<Link to={`/adjudicator/view-critique-feedback/${critiqueFeedbackId}`}>
  View Critique Feedback
</Link>;
```

## Data Structure

The component fetches data using the `getCritiqueFeedbackById` edge function and expects a `CritiqueFeedback` object with the following structure:

```typescript
interface CritiqueFeedback {
  id: string;
  created_at: string;
  user_id: string;
  adjudicator_id: string;
  client_video_id: number;
  status: string;
  feedback_video_id: number;
  completion_date: string;
  critique_id: string;
  review_id: string;
  exercises: string; // JSON string
  suggestions: string; // JSON string
  transcription: string;
  note: string;
  written_feedback: string;
  client_video: ClientVideo;
  feedback_video: FeedbackVideo;
}
```

## Components Used

- **AppLayout**: Main layout wrapper
- **Card**: For organizing content sections
- **Badge**: For status indicators
- **Button**: For navigation and actions
- **Alert**: For error and success messages
- **Separator**: For visual separation

## Styling

The component uses a responsive grid layout:

- Main content (2/3 width on large screens)
- Sidebar (1/3 width on large screens)
- Full width on mobile devices

## Error Handling

- Loading states with skeleton animations
- Error messages for failed data fetching
- Graceful handling of missing data
- JSON parsing error handling for exercises and suggestions

## Security

- Protected route requiring authentication
- Uses signed URLs for video access
- Validates critique feedback ID parameter

## Integration with Existing Components

This component complements the existing `ReviewCritique` component:

- `ReviewCritique`: For editing critique feedback
- `ViewCritiqueFeedback`: For viewing critique feedback (read-only)

## Suggested Enhancements

1. **Add to Completed Critiques Page**: Update the completed critiques list to include links to this view
2. **Add to Dashboard**: Include recent critique feedback in the adjudicator dashboard
3. **Export Functionality**: Add ability to export critique feedback as PDF
4. **Print View**: Add print-friendly styling
5. **Sharing**: Add ability to share critique feedback links
