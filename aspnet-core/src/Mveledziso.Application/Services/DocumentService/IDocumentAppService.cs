using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Mveledziso.Services.DocumentService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.DocumentService
{
    public interface IDocumentAppService : IAsyncCrudAppService<DocumentDto, Guid, GetDocumentInput, CreateDocumentDto, UpdateDocumentDto>
    {
    }
}
