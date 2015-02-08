﻿namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Domain.VoteObject;
    using Newtonsoft.Json;
    using Raven.Client;

    public class RavenDataLoader : IRavenDataLoader
    {
        private readonly IDocumentStore _documentStore;

        public RavenDataLoader(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        } 

        public void LoadVoteObjects()
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var path = String.Format("{0}/Resources/Games.json", AppDomain.CurrentDomain.BaseDirectory);

                using (var streamReader = new StreamReader(path))
                {
                    var fileContent = streamReader.ReadToEnd();
                    var gamesFromFile = JsonConvert.DeserializeObject<ICollection<VoteObject>>(fileContent);
                    var gamesInDatabase = documentSession.Query<VoteObject>().ToList();

                    var gamesToAdd = gamesFromFile.Where(g => gamesInDatabase.All(ga => ga.Name != g.Name)).ToList();

                    foreach (var game in gamesToAdd)
                    {
                        documentSession.Store(game);
                    }
                }

                documentSession.SaveChanges();
            }
        }
    }
}
