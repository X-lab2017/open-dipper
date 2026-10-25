import importlib.util,json,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('collector',Path(__file__).parents[1]/'scripts/collect-events.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Collectors(unittest.TestCase):
 def setUp(self):self.s={'id':'test','name':'Source','category':'release','repository':'test/repo'}
 def test_releases_skip_draft_prerelease_and_unknown_time(self):
  r={'name':'v1','tag_name':'v1','html_url':'https://github.com/test/repo/releases/tag/v1','published_at':'2026-10-01T00:00:00Z','body':'<script>bad</script>Summary'}
  out=m.release_events(self.s,json.dumps([r,r|{'draft':True},r|{'prerelease':True},r|{'published_at':None}]))
  self.assertEqual(len(out),1);self.assertIsNone(out[0]['location']);self.assertNotIn('<script>',out[0]['summary'])
 def test_rss_requires_actual_timestamp(self):
  raw='<rss><channel><item><title>A</title><link>https://example.com/a</link><pubDate>Thu, 01 Oct 2026 10:00:00 GMT</pubDate></item><item><title>B</title><link>https://example.com/b</link></item></channel></rss>'
  out=m.rss_events(self.s,raw);self.assertEqual(len(out),1);self.assertEqual(out[0]['occurredAt'],'2026-10-01T10:00:00Z')
 def test_atom_links_and_dates(self):
  raw='<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>A</title><link href="https://example.com/a"/><updated>2026-10-01T10:00:00Z</updated></entry></feed>'
  self.assertEqual(len(m.rss_events(self.s,raw)),1)
 def test_manual_is_validated_not_executed(self):
  e={'title':'Event','summary':'Summary','sourceUrl':'https://example.com','occurredAt':'2026-10-01T00:00:00Z','category':'community','location':None}
  def issue(payload):return {'number':1,'_approval_valid':True,'html_url':'https://github.com/example/issues/1','body':'```json\n'+json.dumps(payload)+'\n```'}
  out=m.manual_events(self.s,json.dumps([issue(e),issue(e|{'sourceUrl':'javascript:alert(1)'}),issue(e|{'occurredAt':'2026-10-01'}),issue(e|{'location':{'lon':181,'lat':0}})]))
  self.assertEqual(len(out),1);self.assertEqual(out[0]['provenance'],'manual');self.assertEqual(out[0]['reviewStatus'],'reviewed')
 def test_duplicate_stable_identity(self):
  a=m.event(self.s,'A','S','2026-10-01T00:00:00Z','https://example.com/a');b=m.event(self.s,'Updated','S','2026-10-01T00:00:00Z','https://example.com/a');self.assertEqual(a['id'],b['id'])
 def test_edited_issue_requires_fresh_approval(self):
  history=[{'event':'labeled','label':{'name':'event-approved'},'created_at':'2026-10-24T12:00:00Z'}]
  self.assertTrue(m.review_is_current({'updated_at':'2026-10-24T12:00:00Z'},history))
  self.assertFalse(m.review_is_current({'updated_at':'2026-10-24T13:00:00Z'},history))
  self.assertFalse(m.review_is_current({'updated_at':'2026-10-24T12:00:00Z'},[]))
if __name__=='__main__':unittest.main()
