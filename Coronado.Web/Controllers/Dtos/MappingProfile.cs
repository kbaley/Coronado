using AutoMapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Dtos
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Investment, InvestmentForListDto>()
                .ForMember(i => i.LastPrice, opt => opt.MapFrom(src => src.GetLastPrice()))
                .ReverseMap();  
            CreateMap<InvestmentPrice, InvestmentPriceDto>().ReverseMap();  
        }
    }    
}