using AutoMapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Dtos
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Investment, InvestmentForListDto>();  
            CreateMap<InvestmentPrice, InvestmentPriceDto>().ReverseMap();  
        }
    }    
}