using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Enums
{
    public enum NotificationType
    {
        TaskAssigned = 0,
        TaskUpdated = 1,
        CommentAdded = 2,
        DeadlineApproaching = 3,
        MemberAdded = 4,
        DocumentUploaded = 5
    }
}
