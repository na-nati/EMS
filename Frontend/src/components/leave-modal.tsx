import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: string
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedOn: Date
}

interface LeaveApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  request: LeaveRequest | null
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function LeaveApprovalModal({ isOpen, onClose, request, onApprove, onReject }: LeaveApprovalModalProps) {
  if (!request) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Review Leave Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Review the details for {request.employeeName}'s leave request.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Employee:</div>
            <div>{request.employeeName}</div>
            <div className="font-medium">Leave Type:</div>
            <div>{request.leaveType}</div>
            <div className="font-medium">Dates:</div>
            <div>
              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
            </div>
            <div className="font-medium">Days:</div>
            <div>{request.days}</div>
            <div className="font-medium">Reason:</div>
            <div>{request.reason}</div>
            <div className="font-medium">Applied On:</div>
            <div>{new Date(request.appliedOn).toLocaleDateString()}</div>
            <div className="font-medium">Current Status:</div>
            <div>
              <Badge className="capitalize">{request.status}</Badge>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 sm:flex-none border-border hover:bg-muted/50 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={() => onReject(request.id)} variant="destructive" className="flex-1 sm:flex-none">
            Reject
          </Button>
          <Button onClick={() => onApprove(request.id)} className="flex-1 sm:flex-none bg-primary hover:bg-primary/80">
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
