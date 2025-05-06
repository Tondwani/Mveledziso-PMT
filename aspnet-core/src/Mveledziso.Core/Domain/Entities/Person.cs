using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("Persons")]
    public abstract class Person : FullAuditedEntity<Guid>
    {
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
        public virtual string Email { get; set; }
        public virtual string Password { get; set; }
        
        public virtual long UserId { get; set; }

        // Discriminator column for TPH inheritance
        public virtual string PersonType { get; protected set; }
    }
} 