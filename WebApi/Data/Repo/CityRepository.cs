using Microsoft.EntityFrameworkCore;
using webapi.Interfaces;
using WebApi.Models;

namespace WebApi.Data.Repo
{
    public class CityRepository : ICityRepository
    {
        private readonly DataContext _dc;
        public CityRepository(DataContext dc)
        {
            this._dc = dc;

        }

        public void AddCity(City city)
        {
            _dc.Cities.AddAsync(city);
        }

        public void DeleteCity(int CityId)
        {
            var city = _dc.Cities.Find(CityId);
            _dc.Cities.Remove(city);
        }

        public async Task<City> FindCity(int id)
        {
            return await _dc.Cities.FindAsync(id);
        }

        public async Task<IEnumerable<City>> GetCitiesAsync()
        {
            return await _dc.Cities.ToListAsync();
        }
    }
}