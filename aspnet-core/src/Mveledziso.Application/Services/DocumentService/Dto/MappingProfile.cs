using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.DocumentService.Dto
{
    public class DocumentMappingProfile : Profile
    {
        public DocumentMappingProfile()
        {
            CreateMap<Document, DocumentDto>();
            CreateMap<CreateDocumentDto, Document>();
            CreateMap<UpdateDocumentDto, Document>();
        }
    }
}
