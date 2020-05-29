using System;
using AgileObjects.ReadableExpressions;
using AutoMapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Dtos
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Investment, InvestmentForListDto>()
                .ForMember(i => i.LastPrice, opt => opt.MapFrom(src => src.GetLastPriceAmount()))
                .ForMember(i => i.CurrentValue, opt => opt.MapFrom(src => Math.Round(src.Shares * src.GetLastPriceAmount(), 2)))
                .ReverseMap();  
            CreateMap<InvestmentPrice, InvestmentPriceDto>().ReverseMap();  
            CreateMap<InvestmentTransaction, InvestmentTransactionDto>()
                .ForMember(i => i.AccountId, opt => opt.MapFrom(src => src.GetAccountId()))
                .ForMember(i => i.AccountName, opt => opt.MapFrom(src => src.GetAccountName()))
                .ReverseMap();
            CreateMap<InvoiceLineItem, InvoiceLineItemsForPosting>()
                .ReverseMap();
            CreateMap<Invoice, InvoiceForPosting>()
                .ReverseMap()
                .ForMember(dest => dest.Customer, opt => opt.Ignore());
            CreateMap<Account, AccountForPosting>().ReverseMap();
            CreateMap<Transaction, TransactionForDisplay>();

            // Useful for visualizing an AutoMapper mapping
            // var config = new MapperConfiguration(cfg => cfg
            // .CreateMap<InvoiceForPosting, Invoice>()
                // .ForMember(s => s.Customer, opt => opt.Ignore()));
            // var execPlan = config.BuildExecutionPlan(typeof(InvoiceForPosting), typeof(Invoice));
            // var readable = execPlan.ToReadableString();
            // System.Console.WriteLine(readable);
        }
    }    
}
