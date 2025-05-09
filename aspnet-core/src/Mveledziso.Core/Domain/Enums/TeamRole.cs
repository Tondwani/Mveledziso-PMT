using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Enums
{
    public enum TeamRole
    {
        [Description("Team Member")]
        Member = 0,

        [Description("Team Lead")]
        TeamLead = 1,

        [Description("Viewer")]
        Viewer = 2,

    }
}
