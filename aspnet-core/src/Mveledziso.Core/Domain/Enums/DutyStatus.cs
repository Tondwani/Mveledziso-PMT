using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Enums
{
    public enum DutyStatus
    {
        [Description("ToDo")]
        ToDo = 1,

        [Description("InProgress")]
        InProgress = 2,

        [Description("Review")]
        Review = 3,

        [Description("Done")]
        Done = 4,

    }
}
