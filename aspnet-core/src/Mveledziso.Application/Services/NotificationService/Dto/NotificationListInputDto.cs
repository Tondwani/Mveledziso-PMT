using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.NotificationService.Dto
{
    public class NotificationListInputDto
    {
        public long UserId { get; set; } // Recipient filter
        public bool? IsRead { get; set; } // Optional filter
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; } = 10;
    }
}
