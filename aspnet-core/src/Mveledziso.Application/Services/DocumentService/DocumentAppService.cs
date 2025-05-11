using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.DocumentService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace Mveledziso.Services.DocumentService
{
    public class DocumentAppService : AsyncCrudAppService<Document, DocumentDto, Guid, GetDocumentInput, CreateDocumentDto, UpdateDocumentDto>, IDocumentAppService
    {
        private readonly IRepository<Document, Guid> _documentRepository;

        public DocumentAppService(IRepository<Document, Guid> documentRepository)
            : base(documentRepository)
        {
            _documentRepository = documentRepository;
        }

        protected override IQueryable<Document> CreateFilteredQuery(GetDocumentInput input)
        {
            return _documentRepository.GetAll()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(),
                    x => x.FileName.Contains(input.Keyword))
                .WhereIf(input.ProjectDutyId.HasValue,
                    x => x.ProjectDutyId == input.ProjectDutyId.Value)
                .WhereIf(input.FromDate.HasValue,
                    x => x.CreationTime >= input.FromDate.Value)
                .WhereIf(input.ToDate.HasValue,
                    x => x.CreationTime <= input.ToDate.Value.AddDays(1).AddTicks(-1));
        }

        protected override IQueryable<Document> ApplySorting(IQueryable<Document> query, GetDocumentInput input)
        {
            return query.OrderByDescending(x => x.CreationTime);
        }

        public override async Task<DocumentDto> CreateAsync(CreateDocumentDto input)
        {
            var entity = MapToEntity(input);
            await Repository.InsertAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return MapToEntityDto(entity);
        }

        public override async Task<DocumentDto> UpdateAsync(UpdateDocumentDto input)
        {
            var entity = await Repository.GetAsync(input.Id);
            MapToEntity(input, entity);
            await Repository.UpdateAsync(entity);
            return MapToEntityDto(entity);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await Repository.DeleteAsync(input.Id);
        }
    }
}
