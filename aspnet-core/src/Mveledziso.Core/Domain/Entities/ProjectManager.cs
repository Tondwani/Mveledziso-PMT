using System;
using System.Collections.Generic;

namespace Mveledziso.Domain.Entities
{
    public class ProjectManager : Person
    {
        public ProjectManager()
        {
            ManagedProjects = new HashSet<Project>();
            PersonType = "ProjectManager";
        }

        // Collection of projects managed by this project manager
        public virtual ICollection<Project> ManagedProjects { get; set; }

    }
} 