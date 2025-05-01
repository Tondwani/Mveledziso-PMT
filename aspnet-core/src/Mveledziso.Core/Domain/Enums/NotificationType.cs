using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Enums
{
    public enum NotificationType
    {
        [Description("Task Assigned")]
        TaskAssigned = 0,

        [Description("Task Updated")]
        TaskUpdated = 1,

        [Description("Comment Added")]
        CommentAdded = 2,

        [Description("Deadline Approaching")]
        DeadlineApproaching = 3,

        [Description("Member Added")]
        MemberAdded = 4,

        [Description("Document Uploaded")]
        DocumentUploaded = 5
    }
}
