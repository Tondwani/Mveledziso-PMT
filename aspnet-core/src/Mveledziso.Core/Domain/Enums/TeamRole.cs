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

        [Description("Project Manager")]
        ProjectManager = 1,

        [Description("Team Lead")]
        TeamLead = 2,

        [Description("Group Leader")]
        Leader = 3,

        [Description("Viewer")]
        Viewer = 4,

        [Description("Administrator")]
        Admin = 5
    }
}
