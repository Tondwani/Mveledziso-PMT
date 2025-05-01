using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Enums
{
    public enum PriorityLevel
    {
        [Description("Low")]
        Low = 1,

        [Description("Medium")]
        Medium = 2,

        [Description("High")]
        High = 3,

        [Description("Urgent")]
        Urgent = 4
    }
}
