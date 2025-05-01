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
        ToDo = 0,

        [Description("InProgress")]
        InProgress = 1,

        [Description("Review")]
        Review = 2,

        [Description("Done")]
        Done = 3,

    }
}
