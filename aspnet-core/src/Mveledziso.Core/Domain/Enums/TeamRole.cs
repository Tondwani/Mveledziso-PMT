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

        [Description("Product Manager")]
        ProductManager = 2,

        [Description("Developer")]
        Developer = 3,

        [Description("Quality Assurance Engineer")]
        QAEngineer = 4,

        [Description("Business Analyst")]
        BusinessAnalyst = 5,

        [Description("UX Designer")]
        UXDesigner = 6,

        [Description("DevOps Engineer")]
        DevOpsEngineer = 7,

        [Description("Software Developer")]
        SoftwareDeveloper = 8,

        [Description("Product Owner")]
        ProductOwner = 9,

        [Description("Stakeholder")]
        Stakeholder = 10,

        [Description("Technical Architect")]
        TechnicalArchitect = 11,

        [Description("Release Manager")]
        ReleaseManager = 12
    }
}
