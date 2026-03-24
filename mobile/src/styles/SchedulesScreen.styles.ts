import { StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from './theme';

export default StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.bgSecondary,
  },
  container: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.md,
    paddingBottom:     Spacing.md,
    backgroundColor:   Colors.bgSecondary,
  },
  headerTitle: {
    fontSize:           FontSize['2xl'],
    fontWeight:         '800',
    color:              Colors.navy,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.teal,
  },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    Radius.sm,
    backgroundColor: Colors.teal,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.teal,
  },

  // ── Search ──
  searchWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.sm,
  },
  searchBar: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.bgWhite,
    borderRadius:      Radius.md,
    paddingVertical:   11,
    paddingHorizontal: Spacing.md,
    borderWidth:       1.5,
    borderColor:       Colors.tealLight,
    ...Shadow.sm,
  },
  searchInput: {
    flex:       1,
    fontSize:   FontSize.md,
    color:      Colors.navy,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },

  // ── Route Quick List ──
  routeListCard: {
    backgroundColor:  Colors.bgWhite,
    marginHorizontal: Spacing.lg,
    borderRadius:     Radius.lg,
    overflow:         'hidden',
    marginBottom:     Spacing.md,
    ...Shadow.sm,
  },
  routeListItem: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingVertical:   14,
    paddingHorizontal: Spacing.lg,
  },
  routeListBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    borderStyle:       'dashed',
  },
  routeListName: {
    fontSize:   FontSize.md,
    fontWeight: '600',
    color:      Colors.navy,
  },
  routeCodeBadge: {
    paddingVertical:   5,
    paddingHorizontal: 12,
    borderRadius:      Radius.full,
  },
  routeCodeText: {
    color:         '#fff',
    fontWeight:    '800',
    fontSize:      FontSize.sm,
    letterSpacing: 0.5,
  },

  // ── Filters ──
  filterRow: {
    flexDirection:     'row',
    paddingHorizontal: Spacing.lg,
    gap:               Spacing.sm,
    marginBottom:      Spacing.md,
  },
  filterBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    paddingVertical:   8,
    paddingHorizontal: Spacing.md,
    borderRadius:      Radius.full,
    backgroundColor:   Colors.teal,
    ...Shadow.teal,
  },
  filterBtnText: {
    fontSize:   FontSize.sm,
    fontWeight: '700',
    color:      '#fff',
  },

  // ── Schedule Card ──
  scheduleCard: {
    backgroundColor:  Colors.bgWhite,
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.md,
    borderRadius:     Radius.lg,
    overflow:         'hidden',
    borderLeftWidth:  4,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   12,
    paddingHorizontal: Spacing.md,
    gap:               Spacing.sm,
  },
  cardBadge: {
    width:          40,
    height:         40,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  cardBadgeText: {
    color:         '#fff',
    fontWeight:    '800',
    fontSize:      FontSize.sm,
    letterSpacing: 0.5,
  },
  cardHeaderInfo: { flex: 1 },
  cardTitle: {
    fontSize:   FontSize.md,
    fontWeight: '700',
    color:      Colors.navy,
  },
  cardHours: {
    fontSize:  FontSize.sm,
    color:     Colors.slate,
    marginTop: 2,
  },
  cardChevron: {
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: Colors.tealLight,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // ── Card Body (expanded) ──
  cardBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom:     Spacing.md,
    borderTopWidth:    1,
    borderTopColor:    Colors.borderLight,
  },
  cardFrequency: {
    fontSize:   FontSize.sm,
    color:      Colors.slate,
    marginTop:  Spacing.sm,
    lineHeight: 18,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    marginTop:     5,
    gap:           6,
  },
  bulletDot: {
    width:        5,
    height:       5,
    borderRadius: 3,
    marginTop:    6,
  },
  bulletText: {
    fontSize:   FontSize.sm,
    color:      Colors.slate,
    flex:       1,
    lineHeight: 18,
  },
  cardExpanded: {
    fontSize:   FontSize.sm,
    color:      Colors.slate,
    marginTop:  Spacing.sm,
    fontStyle:  'italic',
    lineHeight: 17,
  },
  cardActions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginTop:     Spacing.md,
  },
  cardActionBtn: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    backgroundColor: Colors.teal,
    borderRadius:   Radius.sm,
    paddingVertical: 10,
    ...Shadow.teal,
  },
  cardActionText: {
    fontSize:   FontSize.sm,
    fontWeight: '700',
    color:      '#fff',
  },

  // ── No Results ──
  noResults: {
    marginHorizontal: Spacing.lg,
    backgroundColor:  Colors.borderLight,
    borderRadius:     Radius.md,
    padding:          Spacing.lg,
    alignItems:       'center',
    gap:              Spacing.sm,
    marginBottom:     Spacing.md,
  },
  noResultsTitle: {
    fontSize:   FontSize.md,
    fontWeight: '700',
    color:      Colors.navy,
    textAlign:  'center',
  },
  noResultsSub: {
    fontSize:   FontSize.sm,
    color:      Colors.slate,
    textAlign:  'center',
    lineHeight: 18,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
    alignItems:        'center',
  },
  footerText: {
    fontSize:   11,
    color:      Colors.slate,
    textAlign:  'center',
    lineHeight: 16,
  },
  footerBold: {
    fontWeight: '700',
    color:      Colors.navy,
  },
});