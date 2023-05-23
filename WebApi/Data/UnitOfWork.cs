using webapi.Interfaces;
using WebApi.Data.Repo;
using WebApi.Interfaces;

namespace WebApi.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dc;

        public UnitOfWork(DataContext dc)
        {
            this._dc = dc;
        }

        public ICityRepository CityRepository => 
            new CityRepository(_dc);

        public IUserRepository UserRepository => 
            new UserRepository(_dc);

        public async Task<bool> SaveAsync()
        {
            return await _dc.SaveChangesAsync() > 0;
        }
    }
}