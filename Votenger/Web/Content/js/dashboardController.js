﻿(function () {
    'use strict';

    app.controller('dashboardController', dashboardController);

    dashboardController.$inject = ['VotingSessionStatus', 'votingSessionService', 'DTOptionsBuilder'];

    function dashboardController(VotingSessionStatus, votingSessionService, DTOptionsBuilder) {
        var vm = this;

        vm.VotingSessionStatus = VotingSessionStatus;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('order', [0, 'desc'])
            .withBootstrap();

        vm.draft = draft;
        vm.vote = vote;
        vm.showResults = showResults;
        vm.createSession = createSession;
        vm.completeDraft = completeDraft;
        vm.completeVote = completeVote;

        activate();

        function draft(id) {
            window.location = '/session/draft/' + id;
        }

        function vote(id) {
            window.location = '/session/vote/' + id;
        }

        function showResults(id) {
            window.location = '/session/results/' + id;
        }

        function createSession() {
            window.location = '/session/';
        }

        function completeDraft(id) {
            if (confirm("Are you sure that you want to complete draft?")) {
                votingSessionService.completeDraft(id).success(function() {
                    activate();
                });
            }
        }

        function completeVote(id) {
            if (confirm("Are you sure that you want to complete vote?")) {
                votingSessionService.completeVote(id).success(function() {
                    activate();
                });
            }
        }

        function activate() {
            votingSessionService.getAllVotingSessions().then(function (votingSessions) {
                vm.votingSessions = votingSessions.data;
            });
        }
    }
})();