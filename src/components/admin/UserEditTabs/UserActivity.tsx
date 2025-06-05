import React from 'react';
import { User, ActivityRecord, FlaggedReport } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UserActivityProps {
  user: User;
}

const UserActivity: React.FC<UserActivityProps> = ({ user }) => {
  // Initialize activity object if it doesn't exist
  const activity = user.activity || {
    videoUploads: [],
    critiquesCompleted: [],
    flaggedReports: [],
    critiquesCount: 0
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
          <CardDescription>
            Overview of user's platform activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {user.role === 'adjudicator' ? 'Critiques Completed' : 'Critiques Purchased'}
              </h3>
              <p className="text-2xl font-bold">{activity.critiquesCount || 0}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {user.role === 'user' ? 'Videos Uploaded' : 'Active Since'}
              </h3>
              <p className="text-2xl font-bold">
                {user.role === 'user' ? user.videosUploaded : user.dateJoined}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.role === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle>Video Upload History</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.videoUploads && activity.videoUploads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.videoUploads.map((record: ActivityRecord) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.title}</TableCell>
                      <TableCell>
                        <ActivityStatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>{record.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">No video upload history available</p>
            )}
          </CardContent>
        </Card>
      )}

      {user.role === 'adjudicator' && (
        <Card>
          <CardHeader>
            <CardTitle>Critique Completion History</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.critiquesCompleted && activity.critiquesCompleted.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.critiquesCompleted.map((record: ActivityRecord) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.title}</TableCell>
                      <TableCell>
                        <ActivityStatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>{record.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">No critique history available</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Flagged Reports</CardTitle>
          <CardDescription>
            Issues or concerns reported by or about this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activity.flaggedReports && activity.flaggedReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.flaggedReports.map((report: FlaggedReport) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <ReportStatusBadge status={report.status} />
                    </TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No flagged reports</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ActivityStatusBadgeProps {
  status: string;
}

const ActivityStatusBadge: React.FC<ActivityStatusBadgeProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status}</Badge>;
    case 'pending':
    case 'in progress':
    case 'in review':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{status}</Badge>;
    case 'rejected':
    case 'failed':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface ReportStatusBadgeProps {
  status: string;
}

const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'open':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Open</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
    case 'dismissed':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Dismissed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default UserActivity;
